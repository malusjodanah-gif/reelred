function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const baseStyle =
    "px-5 py-2.5 rounded-lg font-medium transition duration-200";

  const variants = {
    primary:
      "bg-red-600 hover:bg-red-700 text-white",
    secondary:
      "bg-white/10 hover:bg-white/20 text-white",
    outline:
      "border border-white/20 hover:border-red-500 text-white",
    danger:
      "bg-red-900/40 hover:bg-red-900/60 text-red-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;