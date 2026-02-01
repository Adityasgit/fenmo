import { Suspense } from "react";
import ExpenseClient from "./ExpenseClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ExpenseClient />
    </Suspense>
  );
}
