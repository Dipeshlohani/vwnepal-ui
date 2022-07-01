export const COLUMNS = [
    {
        Header: "Name",
        columns: [
            {
                accessor: "name"
            },
        ]
    },
    {
        Header: "Question",
        columns: [
            {
                accessor: "question"
            },
        ]
    },
    {
        Header: "Answers",
        columns: [
            {
                accessor: "answer"
            }]
    },
    {
        Header: "Actions",
        columns: [
            {
                Cell: row => (
                    <div>
                        <button onClick={e => alert('sdfsdf')}>Edit</button>
                        <button onClick={e => alert('sdfasdasdsdf')}>Delete</button>
                    </div>
                ),
                id: "_id"
            },
        ]
    }
];