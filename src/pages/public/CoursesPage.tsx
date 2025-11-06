import heroImage from '../../assets/courses-heroimage.svg';
import FeaturedSubjects from '../../components/FeaturedSubjects';


export default function CoursesPage(){


    return (
        <div className='max-w-7xl mx-auto h-full space-y-10 overflow-y-auto'>
           <header className=" w-full">
            <div className=" p-6  items-center justify-center gap-5  grid lg:grid-cols-2">
                <div className='space-y-3'>
                    <h1 className='text-5xl'> <strong>نقرأ</strong> مهدتلك الطريق </h1>
                    <p className='text-xl max-w-lg'>
                        تصفح الاف الدورات بكل المواد الي محتاج تدرسها بشكل مجاني تماما
                    </p>
                    <form action={'/courses/explore'} className="flex gap-3 items-center max-w-xl pt-5">
                        <input placeholder='ابحث عن الدورات' name='search' type="text" className="p-2 border-emerald-500  flex-1 rounded-md border" />
                        <button className=" text-white p-2 px-5 rounded-md sketch-bg-emerald-600"> ابحث </button>
                    </form>
                </div>
                <img src={heroImage}  alt="" className=" left-40" />
            </div>
           </header>
           {/* Courses by subject */}
           <FeaturedSubjects />
        </div>
    )
}