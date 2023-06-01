// Array of papers (replace with your own data)
var papers = [
    {
        title: "DreamFusion: Text-to-3D using 2D Diffusion",
        date: "2022-09-29",
        projectlink: "https://dreamfusion3d.github.io/",
        arxivlink: "https://arxiv.org/abs/2209.14988",
        githublink: "https://github.com/ashawkey/stable-dreamfusion",
        githublinkname: "stable-dreamfusion",
        details : "",
      },
    {
      title: "ProlificDreamer: High-Fidelity and Diverse Text-to-3D Generation with Variational Score Distillation",
      date: "2023-05-15",
      projectlink: "https://ml.cs.tsinghua.edu.cn/prolificdreamer/",
      arxivlink: "https://arxiv.org/abs/2305.16213",
      githublink: "https://github.com/thu-ml/prolificdreamer",
      details : `- adopts particle-based variabtional inference\n
      - mantains a set of 3D parameters as particles to represent the 3D distribution\n
      - dervie a novel gradient-based update rule for the particles vis the Wasserstein gradient flow\n
      - LoRA提供了更多的prior;SDS更像model seeking，VSD is sampling，所以可以用一些经典采样setting，like CFG\n`
    },
    {
        title: "Zero-1-to-3: Zero-shot One Image to 3D Object",
        date: "",
        projectlink: "https://zero123.cs.columbia.edu/",
        arxivlink: "https://arxiv.org/abs/2303.11328",
        githublink: "https://github.com/cvlab-columbia/zero123",
        details : "",
      },
    {
        title: "Magic3D: High-Resolution Text-to-3D Content Creation",
        date: "",
        projectlink: "https://research.nvidia.com/labs/dir/magic3d/",
        arxivlink: "https://arxiv.org/abs/2211.10440",
        githublink: "",
        details : "",
    },
    {
        title: "Fantasia3D: Disentangling Geometry and Appearance for High-quality Text-to-3D Content Creation",
        date: "2023-03-27",
        projectlink: "https://fantasia3d.github.io/",
        arxivlink: "https://arxiv.org/abs/2303.13873",
        githublink: "https://github.com/Gorilla-Lab-SCUT/Fantasia3D",
        details : "",
    },
    {
      title: "Score Jacobian Chaining: Lifting Pretrained 2D Diffusion Models for 3D Generation",
      date: "",
      projectlink: "https://pals.ttic.edu/p/score-jacobian-chaining",
      arxivlink: "https://arxiv.org/abs/2212.00774",
      githublink: "https://github.com/pals-ttic/sjc/",
      details : "",
    },
    {
      title: "Latent-NeRF for Shape-Guided Generation of 3D Shapes and Textures",
      date: "2022-11-28",
      projectlink: "",
      arxivlink: "https://arxiv.org/abs/2211.07600",
      githublink: "https://github.com/eladrich/latent-nerf",
      details : "",
    },
    {
        title: "",
        date: "",
        projectlink: "",
        arxivlink: "",
        githublink: "",
        details : "",
    },
  ];
  
  // Sort papers by publication date (newest first)
  papers.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate HTML for the paper list
  var paperListHTML = '';
  for (var i = 0; i < papers.length; i++) {
    if (papers[i].title == "") {
        continue;
    }
    paperListHTML += '<summary style="border-top: 1px solid lightgray;">'
    paperListHTML += '<span style="color:#68a0b4;">' + papers[i].title + '</span><br>'
    let hasProceedingElement = false
    if (papers[i].projectlink && papers[i].projectlink !== "") {
        paperListHTML += '<a href=' + papers[i].projectlink +' target="_blank"><i class="fas fa-link" style="margin-right:1px;"></i>Project Page</a> ';
        hasProceedingElement = true
    }
    if (papers[i].arxivlink && papers[i].arxivlink !== "") {
        if (hasProceedingElement) {
            paperListHTML += ' | '
        }
        paperListHTML += '<a href='+ papers[i].arxivlink +' target="_blank"><i class="fas fa-file-pdf" style="margin-right:3px;"></i>arxiv</a> ';
        hasProceedingElement = true
    }
    if (papers[i].githublink && papers[i].githublink !== "") {
        if (hasProceedingElement) {
            paperListHTML += ' | '
        }
        // customized github link name
        let githublinkname = "Github"
        if (papers[i].githublinkname && papers[i].githublinkname !== "") {
            githublinkname = papers[i].githublinkname
        }
        paperListHTML += '<a href='+ papers[i].githublink +' target="_blank"><i class="fab fa-github" style="margin-right:3px;"></i>'+githublinkname+'</a> ';
        hasProceedingElement = true
    }
    if (papers[i].details && papers[i].details !== "") {
        // var md = new Remarkable(); // Create a Remarkable instance
        // var details = md.render(papers[i].details); // Convert Markdown to HTML
        paperListHTML += '<details>\n' + papers[i].details + '</details>'
    }
    paperListHTML += '</summary>'
  }
  
  // Display the paper list
  document.getElementById('paper-list').innerHTML = paperListHTML;
