import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <h1 className="font-display text-5xl md:text-7xl tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        RuedaFlow
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">
        Your Virtual Rueda de Casino Caller
      </p>
    </motion.header>
  );
};

export default Header;
