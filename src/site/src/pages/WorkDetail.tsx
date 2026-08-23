import { useParams, Link } from 'react-router-dom'
import { getWork, works, type Work } from '../data/works'

// 收录的版本正文：<slug>/<version>.md；v0/v1 待数据自动化从 git 历史生成
const fictionContent = import.meta.glob('/data/works/fiction/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// 小说按数据源编号（0、1.1、10.1）排序
function byNumber(a: Work, b: Work) {
  const na = a.number ? Number(a.number.split('.')[0]) : 0
  const nb = b.number ? Number(b.number.split('.')[0]) : 0
  return na - nb
}

// 全部小说列表，用于上一篇/下一篇切换
const fictionList = works.filter(w => w.type === '小说').sort(byNumber)

function renderContent(raw: string) {
  const body = raw.replace(/^# .+\n/, '').trim()
  return body.split('\n\n').map((para, i) => (
    <p key={i}>
      {para.split('\n').flatMap((line, j) =>
        j === 0 ? [line] : [<br key={`br-${i}-${j}`} />, line]
      )}
    </p>
  ))
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const work = slug ? getWork(slug) : undefined

  if (!work) {
    return (
      <div className="page work-detail">
        <Link to="/fictions" className="back-link">&larr; 作品</Link>
        <p className="empty">作品不存在</p>
      </div>
    )
  }

  // 默认查看最新版本（轨迹最后一个）
  const revisions = work.revisions ?? []
  const activeVersion = revisions[revisions.length - 1]?.version ?? 'v2'

  const filePath = `/data/works/fiction/${work.slug}/${activeVersion}.md`
  const raw = fictionContent[filePath]

  // 上一篇 / 下一篇（按编号顺序）
  const idx = fictionList.findIndex(w => w.slug === work.slug)
  const prev = idx > 0 ? fictionList[idx - 1] : undefined
  const next = idx >= 0 && idx < fictionList.length - 1 ? fictionList[idx + 1] : undefined

  return (
    <div className="page work-detail">
      <Link to="/fictions" className="back-link">&larr; 作品</Link>
      <article>
        <header className="detail-header">
          <h1>{work.title}</h1>
          <div className="detail-meta">
            <span className="work-type">{work.type}</span>
            <span className="work-date">{work.date}</span>
          </div>
        </header>

        {raw ? (
          <div className="detail-content">
            {renderContent(raw)}
          </div>
        ) : (
          <p className="empty">该版本正文未收录，仅保留版本记录</p>
        )}
      </article>

      <nav className="prev-next">
        {prev ? (
          <Link to={`/fictions/${prev.slug}`} className="pn-link">
            <span className="pn-label">&larr; 上一篇</span>
            <span className="pn-title">{prev.number ? `${prev.number} ` : ''}{prev.title}</span>
          </Link>
        ) : (
          <span className="pn-empty" />
        )}
        {next ? (
          <Link to={`/fictions/${next.slug}`} className="pn-link pn-next">
            <span className="pn-label">下一篇 &rarr;</span>
            <span className="pn-title">{next.number ? `${next.number} ` : ''}{next.title}</span>
          </Link>
        ) : (
          <span className="pn-empty" />
        )}
      </nav>
    </div>
  )
}
