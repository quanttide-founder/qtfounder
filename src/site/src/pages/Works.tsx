import { Link } from 'react-router-dom'
import { works, type Work, type WorkType } from '../data/works'

// 小说按数据源编号（如 0、1.1、10.1）排序；其他类型按日期倒序
function byNumber(a: Work, b: Work) {
  const na = a.number ? Number(a.number.split('.')[0]) : 0
  const nb = b.number ? Number(b.number.split('.')[0]) : 0
  return na - nb
}

function byDateDesc(a: { date: string }, b: { date: string }) {
  return b.date.localeCompare(a.date)
}

export default function Works({ type, title }: { type: WorkType; title: string }) {
  const list = (type === '小说' ? works.filter(w => w.type === type).sort(byNumber) : works.filter(w => w.type === type).sort(byDateDesc))

  return (
    <div className="page works-page">
      <h1>{title}</h1>

      {list.length === 0 ? (
        <p className="empty">暂无作品</p>
      ) : (
        <div className="works-list">
          {list.map(work => (
            <div className="work-item" key={work.slug}>
              {work.type === '小说' ? (
                <Link to={`/fictions/${work.slug}`} className="work-title">
                  {work.number ? <span className="work-number">{work.number}</span> : null}
                  {work.title}
                </Link>
              ) : (
                <a href={work.link} className="work-title" target="_blank" rel="noopener noreferrer">
                  {work.title}
                </a>
              )}
              <span className="work-date">{work.date}</span>
              <p className="work-desc">{work.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
