"use client"
import InputField from "@/forms/InputField"
import FooterLink from "@/forms/FooterLink"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signIn } from "@/lib/actions/auth.actions"

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  const onSubmit = async (data:SignInFormData) => {
    try {
      const result  = await signIn(data)
      if(result?.success) router.push('/')
    } catch (error) {
      console.error("Error submitting form data:", error)
      toast.error("Sign-in failed",{
        description: error instanceof Error ? error.message : "Failed to sign in. Please try again."
      })
    }
  }

  return (
    <div className="mt-8">
      <h1 className="form-title">Log in to your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email Address"
          placeholder="john.doe@example.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
          }}
        />
        <button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        <FooterLink text="Don't have an account?" linkText="Sign Up" href="/sign-up" />
      </form>
    </div>
  )
}

export default SignIn