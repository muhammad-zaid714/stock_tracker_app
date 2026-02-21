"use client"
import InputField from "@/forms/InputField"
import SelectField from "@/forms/SelectField"
import CountrySelectField from "@/forms/CountrySelectField"
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants"
import {  useForm } from "react-hook-form"
import FooterLink from "@/forms/FooterLink"

const SignUp = () => {
   const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "PK",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  })
  const onSubmit = (data:SignUpFormData) => {
    try {
      console.log(data)
    } catch (error) {
      console.error("Error submitting form data:", error)
    }
  }

  return (
    <>
    <h1 className="form-title">Sign Up & Personalise</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputField
      name="fullName"
      label="Full Name"
      placeholder="John Doe"
      register={register}
      error={errors.fullName}
      validation={{ required: "Full name is required",minlength: {value: 2, message: "Full name must be at least 2 characters"}}}
      />
      <InputField
      name="email"
      label="Email Address"
      placeholder="john.doe@example.com"
      register={register}
      error={errors.email}
      validation={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }}
      />
      <InputField
      name="password"
      label="Password"
      placeholder="Enter your password"
      type="password"
      register={register}
      error={errors.password}
      validation={{ required: "Password is required",minlength: {value: 8, message: "Password must be at least 8 characters"}}}
      />
      <CountrySelectField
      name="country"
      label="Country"
      control={control}
      error={errors.country}
      required
      />
      <SelectField
      name="investmentGoals"
      label="Investment Goals"
      placeholder="Select your investment goals"
      options={INVESTMENT_GOALS}
      control={control}
      error={errors.investmentGoals}
      required
      />
      <SelectField
      name="riskTolerance"
      label="Risk Tolerance"
      placeholder="Select your risk tolerance"
      options={RISK_TOLERANCE_OPTIONS}
      control={control}
      error={errors.riskTolerance}
      required
      />
      <SelectField
      name="preferredIndustry"
      label="Preferred Industry"
      placeholder="Select your preferred industry"
      options={PREFERRED_INDUSTRIES}
      control={control}
      error={errors.preferredIndustry}
      required
      />
      <button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
        {isSubmitting ? "Creating Account..." : "Start Tracking Stocks"}
      </button>
      <FooterLink text="Already have an account?" linkText="Sign In" href="/sign-in" />
    </form>
    </>
  )
}

export default SignUp