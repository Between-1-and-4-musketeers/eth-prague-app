// 'use client'
import Link from "next/link";
import { canisterId, createActor } from "~/declarations/backend";
import { Space } from "~/declarations/backend/backend.did";
import { makeBackendActor } from "~/service/actor-locator";


const backend = makeBackendActor();

export  default async function HomePage() {
  type QueryResponse = {
    Ok: string
  };

  // const query: QueryResponse = await backend.query_filter({ name: "karel" });
//   const query: QueryResponse = await backend.query({ offset: 0, limit: 5 });

//   const parsedQuery = JSON.parse(query.Ok ) as  Space[];
//  console.log(parsedQuery)


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 ">
       {/* {parsedQuery.map((space) => (
        <div className="flex flex-col gap-1 p-2 bg-slate-400 rounded-lg" key={space.id}>
          <img src={space.websiteLink} alt="space icon" />
          <h1 className="">{space.name}</h1>
          </div>
       ))} */}
       <h1>MLem</h1>
      </div>
    </main>
  );
}
