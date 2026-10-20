import { shopInfo } from "./shopInfo.js";
// Four original MP4s supplied by the owner from Downloads/reels.
// Display names were assigned at the owner's request; they are not verified identities.
// To replace a clip, drop its MP4 in public/videos/ and update videoSrc.
// Optional real frame posters go in public/images/reels/. No Instagram embeds are used.
export const videoReviews = [
  { id: 1, type: "mp4", customerName: "Aarav", caption: "A new phone. A happy customer.", rating: 5, videoSrc: "/videos/aarav.mp4", poster: "", verified: false },
  { id: 2, type: "mp4", customerName: "Rohan", caption: `Another upgrade at ${shopInfo.name}.`, rating: 5, videoSrc: "/videos/rohan.mp4", poster: "", verified: false },
  { id: 3, type: "mp4", customerName: "Aditya", caption: "Customer moments from the hub.", rating: 5, videoSrc: "/videos/aditya.mp4", poster: "", verified: false },
  { id: 4, type: "mp4", customerName: "Kunal", caption: "Taking a new favourite home.", rating: 5, videoSrc: "/videos/kunal.mp4", poster: "", verified: false },
];

