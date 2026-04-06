import { Link } from "react-router-dom";

export function SportsScoringCards({items}) {

  return (
    <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-auto">
      {items.map( item => (
            <Link key={item.name} to={`/Sports/${item.name}/scoring`}  data-slot="card" className="flex gap-3 items-center rounded-lg py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer">
               <img src={item.icon} alt="" className="h-6 " />
                <p className=" font-semibold tabular-nums text-red">
                  {item.name}
                </p>
            </Link>
      ))}
    </div>
  )
}
