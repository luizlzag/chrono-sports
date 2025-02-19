export const SendWhatsAppMessage = (message: string) => {
    const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

    const whatsappBaseURL = isMobile
        ? "https://wa.me/?text="
        : "https://web.whatsapp.com/send?text=";
    
      window.open(whatsappBaseURL + encodeURIComponent(message || ""), "_blank");
}
