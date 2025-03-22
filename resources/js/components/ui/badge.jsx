const Badge = ({ children, className = '' }) => {
    return (
      <span 
        className={`
          inline-flex 
          items-center 
          px-3 
          py-1 
          text-sm 
          font-medium 
          rounded-full 
          bg-blue-100 
          text-blue-800 
          ${className}
        `}
      >
        {children}
      </span>
    );
  };
  
  export default Badge;