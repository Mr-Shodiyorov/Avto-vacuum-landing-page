import './why-us.css';

const reasons = [
  {
    title: 'Kechayu kunduz ochiq',
    text: "Soat 3:00 bo'ladimi yoki bayram kunimi — biz ishlaymiz. Oldindan yozilish shart emas.",
  },
  {
    title: 'Tajribali ustalar',
    text: '7 yildan ortiq amaliyot, professional kimyo va uskunalar. Har bir ish uchun javob beramiz.',
  },
  {
    title: 'Qarshida ishonchli',
    text: "Mahalliy mijozlar va doimiy tavsiyalar. Ishimizni Instagram'da har kuni ko'rsatamiz.",
  },
];

export default function WhyUs() {
  return (
    <section className="why-us" id="nega-biz">
      <div className="container">
        <h2 className="why-us__heading" data-reveal>
          Nega aynan biz
        </h2>
        <div className="why-us__grid">
          {reasons.map((reason, i) => (
            <div
              className="why-us__item"
              key={reason.title}
              data-reveal
              style={{ '--reveal-delay': `${i * 120}ms` } as React.CSSProperties}
            >
              <h3 className="why-us__item-title">{reason.title}</h3>
              <p className="why-us__item-text">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
