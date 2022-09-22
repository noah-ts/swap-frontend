import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/swap')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Layout><></></Layout>
}

export default Home
