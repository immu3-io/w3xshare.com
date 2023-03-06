import Layout from '../components/layout/layout'

const Index = () => {
  return (
    <Layout pageName={'W3XShare'}>
      <div className='w3xshare_fn_hero'>
        <div className='bg_overlay'>
          <div className='bg_color' />
          <div className='bg_image' data-bg-img='/img/hero/bg_3.png' />
        </div>
        <div className='hero_content'>
          <div className='container'>
            <div className='content'></div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
