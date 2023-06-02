import app = require("teem");

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		res.render("index/index");
	}

	public async sobre(req: app.Request, res: app.Response) {
		res.render("index/sobre");
	}

	public async cadastro(req: app.Request, res: app.Response) {
		res.render("index/cadastro");
	}
 
	public async produtos(req: app.Request, res: app.Response) {
		let veiculos: any[];

		await app.sql.connect(async (sql: app.Sql) => {
            veiculos = await sql.query("SELECT idveiculo, nome, marca, modelo, cor, ano FROM veiculo");
        });

		res.render("index/produtos", {
			veiculos: veiculos
		});
	}

	@app.http.post()
    @app.route.formData()
    public async criar(req: app.Request, res: app.Response) {
        let veiculo = req.body;
	  
		if (!veiculo) {
            res.status(400).json("Veículo inválido");
			return;
        }

        if (!veiculo.nome) {
            res.status(400).json("Nome do veículo inválido");
			return;
        }

        if (!veiculo.marca) {
            res.status(400).json("Marca do veículo inválido");
			return;
        }

        if (!veiculo.modelo) {
            res.status(400).json("Modelo do veículo inválido");
			return;
        }

        if (!veiculo.cor) {
            res.status(400).json("Cor do veículo inválido");
			return;
        }

        if (!veiculo.ano) {
            res.status(400).json("Ano do veículo inválido");
			return;
        }

		let imagem = req.uploadedFiles["imagem"];
		if (!imagem) {
            res.status(400).json("Imagem do veículo inválido");
			return;
		}

		await app.sql.connect(async (sql: app.Sql) => {
            await sql.beginTransaction();

            await sql.query("INSERT INTO veiculo (nome, marca, modelo, cor, ano) VALUES (?, ?, ?, ?, ?)", [veiculo.nome, veiculo.marca, veiculo.modelo, veiculo.cor, veiculo.ano]);

            let idveiculo = await sql.scalar("SELECT last_insert_id()");

            app.fileSystem.saveUploadedFile("/public/img/veiculos/" + idveiculo + ".jpg", imagem);

            await sql.commit();
        });

        return null;
    }
}

export = IndexRoute;
