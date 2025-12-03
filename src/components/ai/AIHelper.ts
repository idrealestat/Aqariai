export const AIHelper = {
  generateDescription: (listing: any) => {
    // مثال تبسيطي: يمكن توسيعه بتحليل الصور والسعر
    return `وصف آلي: ${listing.title} بمساحة ${listing.area} م² في ${listing.city}.`;
  },
};
