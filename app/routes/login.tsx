import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { Button, Checkbox, Form, Input, type FormProps, message } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

export function meta() {
	return [{ title: "TODO App" }];
}

type FieldTypeLogin = {
	username?: string,
	password?: string,
};

type FieldTypeRegister = {
	email?: string,
	username?: string,
	password?: string,
};

const createRegister = async (data: FieldTypeRegister): Promise<any> => {
	const query = `http://94.74.86.174:8080/api/register`;

	const response = await fetch(query, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response;
};

const handleLogin = async (data: FieldTypeLogin): Promise<any> => {
	const query = `http://94.74.86.174:8080/api/login`;

	const response = await fetch(query, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
	});

	return response.json();
};

const Login = () => {
	const [messageApi, contextHolder] = message.useMessage();
	const [_, setValue] = useLocalStorage("token", "");
	const navigate = useNavigate();

	const { mutateAsync } = useMutation({
		mutationFn: createRegister,
		onError: (error) => {
			console.error("Error:", error);
		},
		onSuccess: (data) => {
			messageApi.info("Register Berhasil silahkan login");
		},
	});

	const onFinishRegister: FormProps<FieldTypeRegister>["onFinish"] = async (values) => {
		try {
			await mutateAsync(values);
		} catch (error) {
			console.error("Error adding post:", error);
		}
	};

	const { mutateAsync: mutateAsyncLogin } = useMutation({
		mutationFn: handleLogin,
		onError: (error) => {
			console.error("Error:", error);
		},
		onSuccess: async (data) => {
			messageApi.info("Login Berhasil");
			setValue(data?.data?.token);
			await navigate("/", { replace: true });
		},
	});

	const onFinishLogin: FormProps<FieldTypeRegister>["onFinish"] = async (values) => {
		try {
			await mutateAsyncLogin(values);
		} catch (error) {
			console.error("Error adding post:", error);
		}
	};

	return (
		<>
			{contextHolder}
			<div className="flex h-screen w-screen items-center justify-center gap-8">
				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-400">
					<div className="flex w-full items-center justify-center bg-blue-500 p-2 text-xl text-white">Login</div>
					<div className="p-8">
						<Form className="flex w-full flex-col justify-end gap-2 p-8" onFinish={onFinishLogin}>
							<Form.Item<FieldTypeLogin>
								label="Username"
								name="username"
								rules={[{ required: true, message: "silahkan masukan username" }]}
							>
								<Input />
							</Form.Item>

							<Form.Item<FieldTypeLogin>
								label="Password"
								name="password"
								rules={[{ required: true, message: "silahkan masukan password" }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item label={null}>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>

				<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-400">
					<div className="flex w-full items-center justify-center bg-blue-500 p-2 text-xl text-white">Register</div>
					<div className="p-8">
						<Form className="flex w-full flex-col justify-end gap-2 p-8" onFinish={onFinishRegister}>
							<Form.Item<FieldTypeRegister>
								label="Email"
								name="email"
								rules={[{ required: true, message: "silahkan masukan email!" }]}
							>
								<Input />
							</Form.Item>
							<Form.Item<FieldTypeRegister>
								label="Username"
								name="username"
								rules={[{ required: true, message: "silahkan masukan username!" }]}
							>
								<Input />
							</Form.Item>

							<Form.Item<FieldTypeRegister>
								label="Password"
								name="password"
								rules={[{ required: true, message: "silahkan masukan password!" }]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item label={null}>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
