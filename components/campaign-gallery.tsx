import Image from "next/image";

const campaigns = [
  { src: "launch-white-brown.jpeg", alt: "RNT launch poster featuring a white and brown sports shoe", title: "Launching soon · White / brown" },
  { src: "launch-roll-number.jpeg", alt: "RNT launch poster featuring a white and tan sports shoe", title: "Style ka naya roll number" },
  { src: "aerospace-7-white-navy.jpeg", alt: "Aerospace 7 in white and navy blue, with RNT product details", title: "Aerospace 7 · White / navy" },
  { src: "sports-collection-2026.jpeg", alt: "RNT 2026 sports collection poster with four shoe styles", title: "2026 sports collection" },
  { src: "launch-unleash-power.jpeg", alt: "RNT campaign poster featuring a black and olive sports shoe", title: "Unleash the power" },
  { src: "aerospace-1-grey-pista.jpeg", alt: "Aerospace 1 Grey Pista product poster, price 689 rupees", title: "Aerospace 1 · Grey Pista" },
  { src: "aerospace-1-bk.jpeg", alt: "Aerospace 1 BK black sports shoe product poster", title: "Aerospace 1 BK" },
  { src: "stryder-3-black-black.jpeg", alt: "Stryder 3 Black on Black product poster, MRP 712 rupees", title: "Stryder 3 · Black / black" }
];

export function CampaignGallery() {
  return (
    <section className="section section--tight campaign-section" aria-labelledby="campaign-heading">
      <div className="section-head">
        <div><div className="section-kicker">RNT COLLECTION ARTWORK</div><h2 id="campaign-heading">The collection, <span>in full colour.</span></h2></div>
      </div>
      <div className="campaign-grid">
        {campaigns.map((campaign) => (
          <figure className="campaign-card" key={campaign.src}>
            <div className="campaign-card__image">
              <Image src={`/campaigns/${campaign.src}`} alt={campaign.alt} fill sizes="(max-width: 760px) 45vw, (max-width: 1100px) 24vw, 22vw" />
            </div>
            <figcaption>{campaign.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
