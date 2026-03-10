import { Hero } from '@/components/modules/Home/Hero';
import Specialities from '@/components/modules/Home/Specialists';
import Steps from '@/components/modules/Home/Steps';
import Testimonials from '@/components/modules/Home/Testimonial';
import TopRatedDoctors from '@/components/modules/Home/TopRatedDoctors';
import React from 'react';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <Specialities></Specialities>
            <TopRatedDoctors></TopRatedDoctors>
            <Steps></Steps>
            <Testimonials></Testimonials>
        </div>
    );
};

export default Home;