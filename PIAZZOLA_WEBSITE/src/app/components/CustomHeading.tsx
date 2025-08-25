import React from 'react'
import Heading from './Heading'


const CustomHeading: React.FC<{ title: string, classname?: string }> = ({ title, classname }) => {
    return (
        <Heading
            className={`${classname}`}
            fontClass="text-neutral-900 text-xl sm:text-3xl md:text-4xl 2xl:text-4xl font-semibold"
            isCenter
            desc=""
            style={{ fontFamily: "Pacifico" }}
        >
            {title}
        </Heading>)
}

export default CustomHeading