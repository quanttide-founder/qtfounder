import { streams } from '../data/streams'

// 联系信息：GitHub 为真实链接；邮件与社交为占位，待作者补充真实值后启用
const contacts = [
  { label: 'GitHub', value: 'github.com/quanttide', href: 'https://github.com/quanttide' },
  { label: '邮件', value: '待补充', href: '' },
  { label: '社交', value: '待补充', href: '' },
]

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <h1 className="hero-tagline">
          创业者，写作者。<br />
          已交付的产品与文字，定义了我的认知。
        </h1>
        <p className="hero-anchor">今日 · journal 1 篇 · 影视规则显性化</p>
      </section>

      <section className="section-domains">
        <h2>创作域</h2>
        <div className="domain-grid">
          {streams.map(stream => (
            <div className="domain-card" key={stream.id}>
              <h3>{stream.name}</h3>
              <p className="domain-status">{stream.status}</p>
              <p className="domain-label">最近动态</p>
              <p>{stream.latest}</p>
              <p className="domain-label">下一步</p>
              <p>{stream.next}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about">
        <h2>关于</h2>
        <p>
          写代码，也写字。在做知识工程相关的事情，业余时间写小说。
        </p>
        <p>
          相信好的故事和好的产品一样，需要对细节的反复打磨。
        </p>
      </section>

      <section className="section-contact">
        <h2>联系</h2>
        <div className="contact-list">
          {contacts.map(contact => (
            <div className="contact-item" key={contact.label}>
              <span className="contact-label">{contact.label}</span>
              {contact.href ? (
                <a href={contact.href} target="_blank" rel="noopener noreferrer">
                  {contact.value}
                </a>
              ) : (
                <span className="contact-placeholder">{contact.value}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
