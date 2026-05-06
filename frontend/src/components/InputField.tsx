import Image from "next/image"

type Props = {
  label: string
  type: string
  placeholder: string
  icon: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function InputField({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange
}: Props) {
  return (
    <div className="flex flex-col">
      <p className="pl-5 pb-2 pt-3">{label}</p>

      <div className="flex items-center justify-center w-120 border border-white/10 rounded-full bg-white/8 hover:bg-white/12 backdrop-blur-md shadow-inner shadow-black/30">
        <Image className="p-4 ml-2 mr-2" src={icon} alt="icon" width={50} height={50} />

        <input
          className="w-full bg-transparent outline-none"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}