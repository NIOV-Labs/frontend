import { AnimatePresence, motion } from "framer-motion";


const ProceedsModal = ({ isOpen, setIsOpen, handleFunds, loading }) => {
  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="bg-slate-900/20 backdrop-blur p-2 sm:p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
                { loading ? (
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFunds();
                        }}
                        className="bg-[#F9FAFF] cursor-pointer text-black px-5 py-4 rounded w-max max-w-lg shadow-xl relative hover:bg-primary1 hover:text-white"
                    >
                        <p>Done</p>
                    </motion.div>
                ) : (

                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFunds();
                        }}
                        className="bg-[#F9FAFF] cursor-pointer text-black px-5 py-4 rounded w-max max-w-lg shadow-xl relative hover:bg-primary1 hover:text-white"
                    >
                        <p>Claim Proceeds?</p>
                    </motion.div>
                )}

            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default ProceedsModal