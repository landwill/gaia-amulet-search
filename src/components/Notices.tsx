interface NoticesProps {
  notices: string[]
}

export const Notices = ({ notices }: NoticesProps) => {
  return <>
    {
      notices.map(notice => {
        return <span key={notice} style={{ pointerEvents: 'none', opacity: 0.55 }}>{notice}</span>
      })
    }
  </>
}