type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "primary" | "secondary"
}

export default function Button({
  children,
  onClick,
  disabled,
  variant = "primary"
}: Props) {

  const base =
    "flex items-center justify-center w-120 h-13 gap-2"

  const styles = {
    primary:
      "border border-white/10  mt-7 rounded-full bg-blue-800 duration-300 hover:bg-blue-700 backdrop-blur-md shadow-inner shadow-black/30 hover:scale-102 hover:font-bold",
    secondary:
      "border border-white/10  mt-1 rounded-full bg-white/80 duration-300 hover:bg-white/90 backdrop-blur-md shadow-inner shadow-black/30 hover:scale-102 hover:font-medium"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}