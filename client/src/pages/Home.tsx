import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.contactId.trim()) {
      toast({
        title: "Contact ID Required",
        description: "Please enter your Telegram or Discord ID.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request Received!",
        description: "We'll notify you when early access is available.",
      });
      setFormData({
        name: "",
        email: "",
        contactId: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] text-white overflow-hidden relative">
      {/* Background gradient waves */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#0E0E10] via-[#1A1A1E] to-transparent opacity-80"></div>
        <div className="absolute -top-[300px] -left-[300px] w-[900px] h-[900px] rounded-full bg-[#00F0FF]/5 blur-[120px]"></div>
        <div className="absolute -top-[150px] -right-[350px] w-[700px] h-[700px] rounded-full bg-[#CC33FF]/5 blur-[100px]"></div>
        <div className="absolute top-[40%] -left-[200px] w-[600px] h-[600px] rounded-full bg-[#FFCC00]/5 blur-[80px]"></div>
        
        {/* Animated circuit lines */}
        <div className="absolute top-[15%] right-[10%] w-[2px] h-[150px] bg-gradient-to-b from-[#00F0FF] to-transparent opacity-50"></div>
        <div className="absolute top-[15%] right-[10%] w-[100px] h-[2px] bg-gradient-to-r from-[#00F0FF] to-transparent opacity-50"></div>
        
        <div className="absolute bottom-[20%] left-[15%] w-[2px] h-[100px] bg-gradient-to-t from-[#CC33FF] to-transparent opacity-40"></div>
        <div className="absolute bottom-[20%] left-[15%] w-[80px] h-[2px] bg-gradient-to-r from-[#CC33FF] to-transparent opacity-40"></div>
        
        {/* Diagonal accent */}
        <div className="absolute top-[30%] right-[30%] w-[300px] h-[3px] bg-gradient-to-r from-[#FFCC00]/60 to-transparent transform rotate-45 opacity-30"></div>
      </div>
      
      {/* Main content */}
      <motion.div 
        className="container mx-auto px-4 py-16 md:py-24 flex-grow flex flex-col justify-center items-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          variants={itemVariants}
        >
          <motion.div 
            className="mb-4 inline-flex justify-center items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#00F0FF]/20 to-[#CC33FF]/20 backdrop-blur-md border border-white/10"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-sm font-medium tracking-wide">COMING SOON</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-sans tracking-tight"
            variants={itemVariants}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-white to-[#CC33FF]">
              THE FUTURE OF CRYPTO
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFCC00] to-[#FF6600]">
              GAMING IS HERE
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Experience the most advanced crypto trading game with real-time markets, 
            competitive gameplay, and cutting-edge technology. Request early access now.
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-lg mx-auto w-full"
            variants={itemVariants}
          >
            <div className="relative">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white/5 border-white/10 backdrop-blur-lg py-6 px-4 rounded-xl text-white placeholder-white/50 focus:border-[#00F0FF]/50 focus:ring-[#00F0FF]/20 focus:ring-opacity-50 w-full transition-all duration-300"
              />
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#CC33FF] to-[#FFCC00] opacity-50 -z-10 blur-[2px] group-hover:opacity-70 transition-opacity"></div>
            </div>
            
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/5 border-white/10 backdrop-blur-lg py-6 px-4 rounded-xl text-white placeholder-white/50 focus:border-[#00F0FF]/50 focus:ring-[#00F0FF]/20 focus:ring-opacity-50 w-full transition-all duration-300"
              />
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#CC33FF] to-[#FFCC00] opacity-50 -z-10 blur-[2px] group-hover:opacity-70 transition-opacity"></div>
            </div>
            
            <div className="relative">
              <Input
                type="text"
                name="contactId"
                placeholder="Your Telegram/Discord ID"
                value={formData.contactId}
                onChange={handleChange}
                className="bg-white/5 border-white/10 backdrop-blur-lg py-6 px-4 rounded-xl text-white placeholder-white/50 focus:border-[#00F0FF]/50 focus:ring-[#00F0FF]/20 focus:ring-opacity-50 w-full transition-all duration-300"
              />
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#CC33FF] to-[#FFCC00] opacity-50 -z-10 blur-[2px] group-hover:opacity-70 transition-opacity"></div>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#00F0FF] to-[#CC33FF] hover:from-[#00E0FF] hover:to-[#B333FF] text-black font-semibold py-6 px-8 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:shadow-[0_0_25px_rgba(0,240,255,0.8)]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                "Request Early Access"
              )}
            </Button>
          </motion.form>
          
          <motion.div 
            className="mt-12 text-white/40 text-sm"
            variants={itemVariants}
          >
            <p>Join our exclusive waiting list. No spam, just updates about launch.</p>
          </motion.div>
        </motion.div>
        
        {/* Features section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-4xl"
          variants={itemVariants}
        >
          <motion.div 
            className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-6 hover:border-[#00F0FF]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#90D8E4]/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <i className="ri-gamepad-line text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Competitive Gaming</h3>
            <p className="text-white/60">Challenge other players in real-time trading competitions</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-6 hover:border-[#CC33FF]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(204,51,255,0.2)]"
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CC33FF] to-[#CC33FF]/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(204,51,255,0.4)]">
              <i className="ri-line-chart-line text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Live Markets</h3>
            <p className="text-white/60">Trade with real-time cryptocurrency market data</p>
          </motion.div>
          
          <motion.div 
            className="backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-6 hover:border-[#FFCC00]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,204,0,0.2)]"
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            variants={itemVariants}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFCC00] to-[#FFCC00]/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,204,0,0.4)]">
              <i className="ri-trophy-line text-xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Rewards & Leaderboards</h3>
            <p className="text-white/60">Win prizes and climb the global rankings</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
