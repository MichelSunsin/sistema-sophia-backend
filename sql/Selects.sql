/* Buscar nome dos alunos e seus responsáveis */

SELECT aluno.nome as NomeAluno,
responsavel.nome as NomeResponsavel
FROM aluno
INNER JOIN responsavelAluno on aluno.matricula = responsavelAluno.matriculaAluno
INNER JOIN responsavel on responsavel.codigo = responsavelAluno.codigoResponsavel;


/* Buscar todos os endereços de todos os alunos */
SELECT aluno.nome, 
endereco.logradouro
FROM endereco
INNER JOIN enderecoAluno ON enderecoAluno.codigoEndereco = endereco.codigo
INNER JOIN aluno ON enderecoAluno.matriculaAluno = aluno.matricula;

/* */
select * from matricula
select * from fichaMedica