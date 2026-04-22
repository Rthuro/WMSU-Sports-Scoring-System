import { Link } from "react-router-dom"
import departments from "@/data/department_loop"

export function PublicSports() {
    return (
        <div className="mx-auto my-24 max-w-6xl pt-8 pb-16 flex flex-col">
            <h1 className="mb-6 border-l-8 border-primary pl-3 font-freshman tracking-wider text-custom-secondary text-2xl">SPORTS</h1>
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3">
                {
                    departments.map((department, idx) => (
                        <Link key={idx} className="p-3 flex items-center gap-2 border border-zinc-200 text-custom-secondary break-normal font-medium text-xs md:text-sm rounded hover:shadow-md" >
                            <img src={department.logo} alt={department.department} srcset="" className="size-10 md:size-12" />
                            {department.department}
                        </Link>
                    ))
                }

            </section>
        </div>
    )
}