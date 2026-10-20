export const shopInfo = {
  name: "Saurabh Mobile Hub",
  legalName: "", // TODO: confirm the registered legal name with the owner.
  tagline: "Genuine Phones. Honest Prices.",
  marathiName: "सौरभ मोबाईल हब",
  phone: "+91-XXXXXXXXXX",
  whatsapp: "91XXXXXXXXXX",
  address: "Digras, Maharashtra",
  hours: "Mon–Sat, 10am–9pm",
  instagram: "https://www.instagram.com/saurabhmobilehub.digras/",
  instagramHandle: "@saurabhmobilehub.digras",
  contactConfigured: false,
};
export const brandDescription = `${shopInfo.name} in ${shopInfo.address}. ${shopInfo.tagline} Explore smartphones and accessories, and confirm prices and availability with the shop.`;
export const whatsappUrl = (
  message = "Hi! I would like to enquire about a product.",
) =>
  shopInfo.contactConfigured
    ? `https://wa.me/${shopInfo.whatsapp}?text=${encodeURIComponent(message)}`
    : null;
