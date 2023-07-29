import { RoomList } from "../types/roomType";

export async function fetchData(): Promise<RoomList> {
  try {
    const response = await fetch("https://choijungle.shop/testdata");
    const jsonData: RoomList = (await response.json()) as RoomList;
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    return {} as RoomList;
  }
}

export function sendData(type) {
  const apiUrl = "https://choijungle.shop/testdata2";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(type),
  }).catch((error) => {
    console.error("data error:", error);
  });
}
