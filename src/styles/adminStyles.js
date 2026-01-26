export const glassyCard = {
  backgroundColor: 'rgba(15,15,17,0.9)',
  color: '#f5f7ff',
  borderRadius: 2.5,
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  backdropFilter: 'blur(12px)',
}

export const mainPaper = {
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  ...glassyCard,
}

export const mainBackground = {
  background: `
    radial-gradient(circle at 20% 20%, rgba(124,77,255,0.10), transparent 32%),
    radial-gradient(circle at 80% 0%, rgba(0,200,83,0.12), transparent 30%),
    radial-gradient(circle at 50% 120%, rgba(255,64,129,0.18), transparent 35%),
    #050507`,
  color: '#e9ecf5',
}
