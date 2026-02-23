import { inngest } from "@/lib/inngest/client"
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts"
import { success } from "better-auth"
import { sendWelcomeEmail } from "../nodeMailer"


export const sendSignUpEmail = inngest.createFunction(
    {id:'sign-up-email'},
    {event:'app/user.created'},
    async ({event, step})=>{
        const preferredIndustries = Array.isArray(event.data.preferredIndustries) 
            ? event.data.preferredIndustries.join(', ') 
            : event.data.preferredIndustries;
        const userProfile =`Country: ${event.data.country}\nInvestment Goal: ${event.data.investmentGoal}\nRisk Tolerance: ${event.data.riskTolerance}\nPreferred Industries: ${preferredIndustries}`
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [{
                    role: 'user',
                    parts: [
                        {text:prompt}]
            }]
                }
        })
        await step.run('send-welcome-email',async()=>{
            const part = response.candidates?.[0]?.content?.parts?.[0]
            const introText = (part && 'text' in part ? part.text : null)|| 'Thanks for signing up for Signalist! We\'re excited to have you on board and can\'t wait to help you make smarter investment decisions. If you have any questions or need assistance, feel free to reach out to our support team. Happy investing!'
            const {data:{email,name}} = event;
            return await sendWelcomeEmail({email,name,intro:introText})
        })
        return {
            success: true,
            message:'Welcome email sent successfully'
        }
    }
)