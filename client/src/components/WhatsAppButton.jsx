import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/919876543210?text=Hi!%20I%27m%20interested%20in%20wholesale%20dress%20orders%20from%20Arlan%20Toph%20Forth."
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-premium hover:bg-green-600 transition-all duration-300 hover:scale-110 group"
        >
            <FaWhatsapp size={28} />
            <span className="absolute right-full mr-3 whitespace-nowrap bg-fashion-dark text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Bulk Order Inquiry
            </span>
        </a>
    );
};

export default WhatsAppButton;
