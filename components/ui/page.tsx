import Featured from '@/components/Featured'
import Offer from '@/components/Offer'
import Slider from '@/components/Slider'
import Categories from '@/components/Categories'
import Products from '@/components/Products'
import SecondFeatured from '@/components/SecondFeatured'
import Restaurants from '@/components/Restaurants'
import Location from '@/components/Location'
import { motion } from 'framer-motion'

export default function Home() {

  return (
   
    <main className='md:relative mobile'>
      <Slider/>
      <Featured/>
      <Offer/>
      <Products />
      <Location />
      <Restaurants />    
      </main>
  )
}
