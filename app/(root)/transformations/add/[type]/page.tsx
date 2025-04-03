import React from "react";
import { transformationTypes } from "@/app/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Header from "@/app/components/shared/Header";
import { TransformationForm } from "@/app/components/shared/TransformationForm";
import { userId } from "@/app/components/shared/UserId";

interface SearchParamsProps {
  params: { type: string }; // Keep type as string initially
}

const AddTransformationTypePage = async ({ params }: SearchParamsProps) => {
  if (!userId) redirect("/login");

  const user = await getUserById(userId);
  const { type } = await params; // Access params inside function

  const transformation = transformationTypes[type as keyof typeof transformationTypes];

  if (!transformation) return redirect("/404"); // Handle invalid type

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
