import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/ui/Layout";

export default function Patient() {
  const route = useRouter();
  console.log(route);
  return (
    <Layout>
      <div className="my-4 p-4">
        <p>Chart for {route.query.name} will go here soon</p>
      </div>
    </Layout>
  );
}
