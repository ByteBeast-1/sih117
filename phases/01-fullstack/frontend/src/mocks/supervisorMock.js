// Mock data for the Supervisor/Coding Agent — matches CONTRACTS.md Section 3 exactly
export const supervisorMockResponse = {
  reply: "I've added a try/except block around the file read. Running it now...",
  proposed_file_edits: [
    {
      filename: "calc.py",
      diff: `--- calc.py
+++ calc.py
@@ -1,4 +1,8 @@
-data = open("input.txt").read()
-result = int(data) * 42
-print(result)
+try:
+    data = open("input.txt").read()
+    result = int(data) * 42
+    print(result)
+except FileNotFoundError:
+    print("Error: input.txt not found")
+except ValueError:
+    print("Error: invalid data in file")`,
      requires_confirmation: true
    }
  ],
  routed_to_agent: null,
  sandbox_result: {
    success: true,
    stdout: "42\n",
    stderr: "",
    exit_code: 0
  }
};

// Mock for a request that gets routed to the generation agent
export const supervisorRoutedMockResponse = {
  reply: "I'll route this to the Generation agent to create your document...",
  proposed_file_edits: [],
  routed_to_agent: "generation",
  sandbox_result: null
};

// Mock generation status — matches CONTRACTS.md Section 4
export const generationStatusMock = {
  status: "completed",
  generated_files: [
    {
      filename: "approval_note.docx",
      download_url: "/api/v1/deliverables/task-001/approval_note.docx"
    }
  ]
};

// Mock WebSocket stream messages for live thinking trace
export const supervisorStreamMessages = [
  { type: "thinking", content: "Analyzing the uploaded file..." },
  { type: "thinking", content: "Identifying areas for error handling..." },
  { type: "thinking", content: "Adding try/except blocks around file I/O..." },
  { type: "sandbox_output", content: "$ python calc.py" },
  { type: "sandbox_output", content: "42" },
  { type: "sandbox_output", content: "Process exited with code 0" }
];
