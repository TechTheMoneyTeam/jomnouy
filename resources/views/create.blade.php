<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Project</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="container mt-5">
        <h1>Create New Project</h1>
        <form id="projectForm">
            @csrf
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" name="title" required>
            </div>
            <div class="mb-3">
                <label for="project_des" class="form-label">Project Description</label>
                <textarea class="form-control" id="project_des" name="project_des" required minlength="50"></textarea>
            </div>
            <div class="mb-3">
                <label for="project_type_id" class="form-label">Project Type</label>
                <select class="form-select" id="project_type_id" name="project_type_id" required>
                    @foreach ($projectTypes as $projectType)
                        <option value="{{ $projectType->id }}">{{ $projectType->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="mb-3">
                <label for="category_id" class="form-label">Category</label>
                <select class="form-select" id="category_id" name="category_id" required>
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}">{{ $category->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="mb-3">
                <label for="funding_goal" class="form-label">Funding Goal</label>
                <input type="number" class="form-control" id="funding_goal" name="funding_goal" required min="1">
            </div>
            <div class="mb-3">
                <label for="reverse_price" class="form-label">Reverse Price</label>
                <input type="number" class="form-control" id="reverse_price" name="reverse_price" required min="0">
            </div>
            <div class="mb-3">
                <label for="project_img" class="form-label">Project Image URL</label>
                <input type="url" class="form-control" id="project_img" name="project_img" required>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" name="status" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Create Project</button>
        </form>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
    <script>
        document.getElementById('projectForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);

            fetch('{{ route('projects.store') }}', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>