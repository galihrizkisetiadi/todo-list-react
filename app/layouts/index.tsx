import { Outlet } from "react-router";
import type { Route } from "../+types/root";

export default function IndexLayout({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<div className="border-b-2 border-gray-200 bg-blue-500 p-3 text-3xl text-white">To Do List</div>
			<main className="p-14">
				<Outlet context={loaderData} />
			</main>
		</>
	);
}
