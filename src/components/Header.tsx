import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center px-6 py-4 mb-2"
    >
      {/* Logo */}
      <span className="font-display text-2xl tracking-widest">
        RUEDA <span className="text-primary">FLOW</span>
      </span>
    </motion.header>
  );
};

export default Header;
