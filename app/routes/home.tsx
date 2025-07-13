import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, type FormProps, message, Checkbox } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";

const Home = () => {
	const [valueToken] = useLocalStorage("token", "");
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		if (!valueToken) {
			navigate("/login", { replace: true });
		}
	}, []);

	const getChecklist = async (): Promise<any> => {
		const query = `http://94.74.86.174:8080/api/checklist`;

		const response = await fetch(query, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${valueToken}`,
			},
		});

		return response.json();
	};

	const onChangeCheckbox = async (checklistId: number, id: number): Promise<any> => {
		const query = `http://94.74.86.174:8080/api/checklist/${checklistId}/item/${id}`;

		const response = await fetch(query, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${valueToken}`,
			},
		});

		refetch();

		return response.json();
	};

	const createChecklist = async (data: { name: string }): Promise<any> => {
		const query = `http://94.74.86.174:8080/api/checklist`;

		const response = await fetch(query, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${valueToken}`,
			},
		});

		return response;
	};

	const { mutateAsync } = useMutation({
		mutationFn: createChecklist,
		onError: (error) => {
			console.error("Error:", error);
		},
		onSuccess: (data) => {
			messageApi.info("Berhasil membuat checklist");
			refetch();
		},
	});

	const onFinish: FormProps<{ name: string }>["onFinish"] = async (values) => {
		try {
			await mutateAsync(values);
		} catch (error) {
			console.error("Error adding post:", error);
		}
	};

	const { data, refetch } = useQuery({
		queryKey: ["checklist"],
		queryFn: getChecklist,
	});

	const colors = ["red", "blue", "green", "purple", "pink"];

	return (
		<div className="flex flex-col gap-8 p-20">
			<div className="text-xl font-bold">Checklist baru</div>
			<div className="flex flex-col gap-8">
				<Form className="flex w-full gap-2 p-8" onFinish={onFinish}>
					<Form.Item<{ name: string }>
						label="Nama Checklist"
						name="name"
						rules={[{ required: true, message: "Silahkan masukan nama" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item label={null}>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>

			{/* <div className="bg-red-500"></div> */}
			<div className="text-xl font-bold">Checklist yang anda miliki</div>
			<div className="grid grid-cols-4 gap-2">
				{data?.data?.map((checklist: any, index: number) => {
					return (
						<div
							key={index}
							className={`flex flex-col gap-4 rounded-md p-2 text-white`}
							style={{ backgroundColor: colors[Math.floor(Math.random() * 4)] }}
						>
							<div className="text-lg font-bold">{checklist?.name}</div>
							<div className="flex flex-col gap-4">
								{checklist?.items?.map((item: any, indexItem: number) => {
									return (
										<div key={indexItem} className="flex gap-2">
											<Checkbox
												checked={item?.itemCompletionStatus}
												onChange={() => onChangeCheckbox(checklist?.id as number, item?.id as number)}
											/>
											{item?.name}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Home;
