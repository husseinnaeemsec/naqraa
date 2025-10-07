interface Props {
    show:boolean;
    onClose?:()=> void;
}
export default function TodoForm( {  show  } : Props ){



    if(!show){
        return <></>
    }

    const priorities = [
        {
            ar:'منخفض',
            en:'low',
            color:'text-indigo-600 border-indigo-500 checked:bg-indigo-500'
        },
        {
            ar:'متوسط',
            en:'medium',
            color:'text-yellow-600 border-yellow-500 checked:bg-yellow-500'
        },
        {
            ar:'عالي',
            en:'high',
            color:'text-orange-600 border-orange-500 checked:bg-orange-500'
        },
        {
            ar:'عاجل',
            en:'urgent',
            color:'text-rose-600 border-rose-500 checked:bg-rose-500'
        },
    ]
    
    return (
        <div className="fixed inset-0 w-full h-full z-50 bg-black/30 flex items-center justify-center backdrop-blur-xs">
            <div className="max-w-lg bg-white text-sm w-full p-4 rounded-md space-y-3">
                <h1 className="text-lg font-semibold"> اضافة مهمة جديدة </h1>
                <input type="text" className="p-2 rounded border w-full" placeholder="العنوان" />
                <textarea name="" placeholder="الوصف" id="" className="p-2 rounded border w-full"></textarea>
                <label htmlFor="" className="p-2"> الاهمية </label>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {
                        priorities.map((p)=>{
                            return <input name="praiority" data-label={p.ar} type="radio" className={`radio-btn ${p.color} `} key={p.en} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}