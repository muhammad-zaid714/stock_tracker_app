import { inngest } from "@/lib/inngest/client"
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts"
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodeMailer"
import { getAllUsersForNewsEmail } from "../actions/user.actions"
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions"
import { getNews } from "../actions/finnhub.actions"


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

export const sendDailyNewsSummary = inngest.createFunction(
    {id:'daily-news-summary'},
    [{event:'app/send.daily.news'},{cron:'0 12 * * *'}],
    async({step})=>{
        const users = await step.run('get-all-users',getAllUsersForNewsEmail)
        console.log('Users fetched:', users?.length || 0, users);
        
        if(!users || users.length === 0) {
            return {
                success: true,
                message: 'No users found for daily news summary'
            }
        }

       const userNews = await step.run('build-user-news', async () => {
            return Promise.all(
                users.map(async (user) => {
                    const symbols = await getWatchlistSymbolsByEmail(user.email)
                    console.log(`Symbols for ${user.email}:`, symbols);
                    try {
                        const news = await getNews(symbols)
                        console.log(`News for ${user.email}:`, news?.length || 0);
                        return {
                            user,
                            news: news.slice(0, 6)
                        }
                    } catch (error) {
                        console.error(`Error fetching news for ${user.email}:`, error)
                        return {
                            user,
                            news: []
                        }
                    }
                })
            )
        })

       const userNewsSummaries:{user:User;newsContent:string}[] = [];
        for (const { user, news } of userNews) {
            console.log(`Processing ${user.email}, news count:`, news.length);
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(news,null,2))
                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents: [{
                            role: 'user',
                            parts: [
                                {text:prompt}]
                    }]
                    }
                })
                const part = response.candidates?.[0]?.content?.parts?.[0]
                const newsContent = (part && 'text' in part ? part.text : null) || 'We had trouble generating your news summary today. Please check back later.'
                userNewsSummaries.push({user, newsContent})
                console.log(`Summary created for ${user.email}`);
            } catch (error) {
                console.error(`Error generating news summary for ${user.email}:`, error)
                userNewsSummaries.push({user, newsContent: 'We had trouble fetching your news summary today. Please check back later.'})
            }
        }
        
        console.log('Total summaries to send:', userNewsSummaries.length);

        await step.run('send-news-emails', async () => {
            const emailResults = await Promise.allSettled(
                userNewsSummaries.map(({ user, newsContent }) =>
                    sendNewsSummaryEmail({
                        email: user.email,
                        name: user.name,
                        newsContent
                    })
                )
            );
            
            const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
            const failedCount = emailResults.filter(result => result.status === 'rejected').length;
            
            if (failedCount > 0) {
                console.error(`Failed to send ${failedCount} news summary emails`);
                emailResults.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(`Email ${index} failed:`, result.reason);
                    }
                });
            }
            
            console.log(`Emails sent: ${successCount}, failed: ${failedCount}`);
            
            return {
                sent: successCount,
                failed: failedCount,
                total: userNewsSummaries.length
            };
        })

        return { success: true }
    }
    
)

// Note: `userNews` is defined inside sendDailyNewsSummary; build summaries there instead of at top-level.