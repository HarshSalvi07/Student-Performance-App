import axios from "axios"

type Props = {
    id: number
}

function DeleteHistory({ id }: Props) {

    const deleteRecord = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete this analysis?"
        )

        if (!confirmDelete) return

        try {
            const token = localStorage.getItem("access_token")

            await axios.delete(
                `http://127.0.0.1:8000/history/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            window.location.reload()

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <button
            onClick={deleteRecord}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
            Delete
        </button>
    )
}

export default DeleteHistory