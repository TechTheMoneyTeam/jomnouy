<?php
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        // Validation
        $request->validate([
            'title' => 'required|string|max:255',
            'project_des' => 'required|string',
            'funding_goal' => 'required|numeric',
            'reverse_price' => 'required|numeric',
            'category_id' => 'nullable|exists:categories,id',
            'project_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        // Create Project
        $project = new Project();
        $project->user_id = auth()->id();  // Get the authenticated user
        $project->title = $request->title;
        $project->project_des = $request->project_des;
        $project->funding_goal = $request->funding_goal;
        $project->reverse_price = $request->reverse_price;
        $project->category_id = $request->category_id;
        
        if ($request->hasFile('project_img')) {
            $file = $request->file('project_img');
            $path = $file->store('projects/images', 'public');
            $project->project_img = $path;
        }

        $project->save();
        
        return response()->json(['message' => 'Project created successfully', 'project' => $project]);
    }

    // File Upload Function (if needed for video or other file types)
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        // Process the file upload
        $path = $request->file('file')->store('uploads', 'public');

        return response()->json(['message' => 'File uploaded successfully', 'file_path' => $path]);
    }
}
