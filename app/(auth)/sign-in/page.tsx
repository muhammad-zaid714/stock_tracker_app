"use client"
import InputField from "@/components/forms/InputField"
import FooterLink from "@/components/forms/FooterLink"
import { useForm } from "react-hook-form"

const SignIn = () => {
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

  const onSubmit = (data: SignInFormData) => {
    try {
      console.log(data)
    } catch (error) {
      console.error("Error submitting form data:", error)
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