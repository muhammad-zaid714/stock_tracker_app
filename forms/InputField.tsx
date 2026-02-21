import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"
import { Label } from "../components/ui/label"

const InputField = ({name,label,placeholder,type='text',register,error,validation,disabled,value}:FormInputProps) => {
  return (
    <div className="space-y-2">
        <Label htmlFor={name} className="form-label">
            {label}
        </Label>
        <Input
            name={name}
            type={type}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            className={cn('form-input',{'opacity-50 cursor-not-allowed': disabled})}
            {...register(name, validation)}
            /> 
        
       
            {
                error && <p className="text-sm text-red-500 mt-1">{error.message}</p>
            }
    </div>
  )
}

export default InputField