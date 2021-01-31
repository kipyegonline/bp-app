import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/ui/Layout";
import { Skeleton } from "@material-ui/lab";

export default function Patient() {
  const route = useRouter();

  React.useEffect(() => {
    console.log(route);
  });
  return (
    <Layout>
      <div className="my-4 p-4">
        <p>Chart for {route.query.name} will go here soon</p>
        <Skeleton></Skeleton>
      </div>
    </Layout>
  );
}
