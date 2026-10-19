export const shopInfo = {
  name: "Saurabh Mobile Hub",
  phone: "+91-XXXXXXXXXX",
  whatsapp: "91XXXXXXXXXX",
  address: "Digras, Maharashtra, India",
  hours: "Mon–Sat, 10am–9pm",
  instagram: "https://www.instagram.com/saurabhmobilehub.digras/",
  instagramHandle: "@saurabhmobilehub.digras",
  contactConfigured: false,
};
export const whatsappUrl = (
  message = "Hi! I would like to enquire about a product.",
) =>
  shopInfo.contactConfigured
    ? `https://wa.me/${shopInfo.whatsapp}?text=${encodeURIComponent(message)}`
    : null;
