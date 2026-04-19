export const FmtBtn = ({ label, icon, onClick, disabled, variant = 'pdf' }) => {
  const styles = {
    pdf:   'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
    excel: 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${styles[variant]} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {icon}
      {label}
    </button>
  );
};
