import React from "react";
import { Header } from "components";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { user, users } from "~/constants";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);
  return {
    users: users.map((user) => ({ ...user })), // ← converts null prototype to plain object
    total,
  };
};
const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const users = loaderData?.users ?? [];
  return (
    <main className="all-users wrapper">
      <Header title="manage users" description="check out our users" />
      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: any) => (
              <div className="flex items-center gap-1.5 px-4">
                <img
                  src={props.imageUrl ?? "/assets/icons/avatar.svg"}
                  alt="user"
                  className="rounded-full size-8 aspect-square"
                  referrerPolicy="no-referrer"
                />
                <span className="">{props.name}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email"
            headerText="Email"
            width="150"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="150"
            textAlign="Left"
            template={({ joinedAt }) => formatDate(joinedAt)}
          />
          <ColumnDirective
            field="accountId"
            headerText="Trip Created"
            width="130"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
            template={(props: UserData) => (
              <article
                className={cn(
                  "status-column",
                  props.status === "user" ? "bg-success-50" : "bg-light-300",
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    props.status === "user" ? "bg-success-500" : "bg-gray-500",
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    props.status === "user"
                      ? "text-success-700"
                      : "text-gray-500",
                  )}
                >
                  {props.status}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};

export default AllUsers;
